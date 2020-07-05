function build_options(opt) {
    var options = opt.split('|#|');
    var result = [];
    options.forEach((item, i) => {
        var o = item.split('|^|');
        result.push({
          option: o[0],
          prompt: o[1]
        })
    });
    return result;
}

function build_question(question) {
    return {
        label: question.label,
        content: question.content,
        options: build_options(question.options)
    };
}

function build_prompts(item, list) {
  return {
      name: item.question_name,
      intro: item.intro,
      prompts: list,
      extra: item.extra,
    }
}

function build_prompt(item) {
  return {
      name: item.question_name,
      intro: item.intro,
      prompt: item.prompt
  }
}

function build_answer(prompt, student, quizData, top) {
  return {
      prompt,
      answers: student.answers,
      name: student.first_name + ' ' + student.last_name,
      quizData,
      top
  }
}

module.exports = {
  build_answer,
  build_options,
  build_prompt,
  build_prompts,
  build_question,
}
