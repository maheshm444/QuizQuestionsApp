import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { saveQuestion, getQuestion } from "../services/questionService";

class QuestionForm extends Form {
  state = {
    data: {
      title: "",
      option1: "",
      option2: "",
      option3: "",
    },
    errors: {}
  };

  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    option1: Joi.string()
      .required()
      .label("Option1"),      
    option2: Joi.string()
      .required()
      .label("Option2"),      
    option3: Joi.string()
      .required()
      .label("Option3")
  };


  async populateQuestion() {
    try {
      const questionId = this.props.match.params.id;
      if (questionId === "new") return;
      const { data: question } = await getQuestion(questionId);
      this.setState({ data: this.mapToViewModel(question) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateQuestion();
  }

  mapToViewModel(question) {
    console.log(question);
    return {
      _id: question._id,
      title: question.title,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
    };
  }

  doSubmit = async () => {
    await saveQuestion(this.state.data);

    this.props.history.push("/questions");
  };

  render() {
    return (
      <div>
        <h1>Question Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Question ?")}
          {this.renderInput("option1", "Option1")} 
          {this.renderInput("option2", "Option2")}
          {this.renderInput("option3", "Option3")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default QuestionForm;
