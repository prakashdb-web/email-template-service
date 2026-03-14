exports.prepareTemplate = (template, values) => {

  let result = template;

  for (let key in values) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, "g"), values[key]);
  }

  return result;

};