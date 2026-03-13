function parsetemplate(template, data)
{
    let result = template;

    for (const key in data) {
        const value = data[key];

        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value);
    }
    return result;
}
module.exports = parsetemplate;