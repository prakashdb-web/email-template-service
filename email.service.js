'use strict';

const TemplateModel  = require('../models/Template.model');
const EmailLogModel  = require('../models/EmailLog.model');
const { renderTemplate, extractPlaceholderIndices } = require('../utils/templateEngine');
const { sendMail }   = require('../utils/mailer');
const AppError       = require('../utils/AppError');
const logger         = require('../utils/logger');

/**
 * EmailService — orchestrates template resolution, rendering, sending, and logging.
 */
class EmailService {

  /**
   * Send an email using a stored template.
   *
   * @param {Object}   opts
   * @param {string}   opts.templateName   - Template name (must exist in DB)
   * @param {string}   [opts.templateId]   - Or look up by UUID
   * @param {string}   opts.recipientEmail - To address
   * @param {string}   [opts.recipientName]
   * @param {Object}   opts.values         - { "1": "Light", "2": "Pushan", … }
   * @param {string}   [opts.replyTo]
   * @param {Object[]} [opts.attachments]  - Nodemailer attachment objects
   * @param {string}   [opts.requestId]    - From X-Request-Id header (for tracing)
   * @returns {Promise<Object>}
   */
  static async sendTemplatedEmail({
    templateName,
    templateId,
    recipientEmail,
    recipientName,
    values = {},
    replyTo,
    attachments,
    requestId,
  }) {
    // ── 1. Resolve template ───────────────────────────────────────────────────
    let template;
    if (templateId) {
      template = await TemplateModel.findById(templateId);
    } else if (templateName) {
      template = await TemplateModel.findByName(templateName);
    }
    if (!template) {
      throw new AppError('Email template not found.', 404, 'TEMPLATE_NOT_FOUND');
    }
    if (!template.is_active) {
      throw new AppError('Email template is disabled.', 422, 'TEMPLATE_INACTIVE');
    }

    // ── 2. Validate that all required placeholders have values ────────────────
    const combined = `${template.subject} ${template.body_html} ${template.body_text || ''}`;
    const required = extractPlaceholderIndices(combined);
    const missing  = required.filter(idx => !Object.prototype.hasOwnProperty.call(values, String(idx)));

    if (missing.length > 0) {
      throw new AppError(
        `Missing placeholder values: ${missing.map(i => `{{${i}}}`).join(', ')}`,
        400, 'MISSING_PLACEHOLDERS',
        missing.map(i => ({ placeholder: `{{${i}}}`, index: i }))
      );
    }

    // ── 3. Render subject + body ──────────────────────────────────────────────
    const rendered = renderTemplate(template, values);
    logger.debug(`Rendered subject: "${rendered.subject}"`);

    // ── 4. Create log entry (status=queued) ───────────────────────────────────
    const logId = await EmailLogModel.create({
      template_id    : template.id,
      request_id     : requestId,
      recipient_email: recipientEmail,
      recipient_name : recipientName,
      subject        : rendered.subject,
      placeholders   : values,
      status         : 'queued',
    });

    // ── 5. Send via SMTP ──────────────────────────────────────────────────────
    try {
      const toAddress = recipientName
        ? `"${recipientName}" <${recipientEmail}>`
        : recipientEmail;

      const info = await sendMail({
        to         : toAddress,
        subject    : rendered.subject,
        html       : rendered.html,
        text       : rendered.text,
        replyTo,
        attachments,
      });

      // ── 6. Mark log as sent ──────────────────────────────────────────────────
      await EmailLogModel.updateStatus(logId, 'sent', { smtp_message_id: info.messageId });

      return {
        logId,
        messageId      : info.messageId,
        templateUsed   : template.name,
        recipientEmail,
        subject        : rendered.subject,
      };

    } catch (smtpErr) {
      // ── 7. Mark log as failed ────────────────────────────────────────────────
      await EmailLogModel.updateStatus(logId, 'failed', { error_message: smtpErr.message });
      logger.error(`SMTP send failed (logId=${logId}): ${smtpErr.message}`);
      throw new AppError(`Email delivery failed: ${smtpErr.message}`, 502, 'SMTP_ERROR');
    }
  }

  /**
   * Send an ad-hoc email without a stored template (raw subject + body).
   * Useful for quick notifications from the parent website.
   */
  static async sendRawEmail({ recipientEmail, recipientName, subject, html, text, replyTo, attachments, requestId }) {
    const logId = await EmailLogModel.create({
      template_id    : null,
      request_id     : requestId,
      recipient_email: recipientEmail,
      recipient_name : recipientName,
      subject,
      placeholders   : null,
      status         : 'queued',
    });

    try {
      const toAddress = recipientName ? `"${recipientName}" <${recipientEmail}>` : recipientEmail;
      const info = await sendMail({ to: toAddress, subject, html, text, replyTo, attachments });
      await EmailLogModel.updateStatus(logId, 'sent', { smtp_message_id: info.messageId });
      return { logId, messageId: info.messageId, recipientEmail, subject };
    } catch (smtpErr) {
      await EmailLogModel.updateStatus(logId, 'failed', { error_message: smtpErr.message });
      throw new AppError(`Email delivery failed: ${smtpErr.message}`, 502, 'SMTP_ERROR');
    }
  }

  /** Fetch paginated email logs */
  static async getLogs(query) {
    return EmailLogModel.findAll(query);
  }
}

module.exports = EmailService;
