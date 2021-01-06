import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class QuestionsTable extends Component {

  columns = [
    {
      path: "title",
      label: "Title",
      content: question => <Link to={`/questions/${question._id}`}>{question.title}</Link>
    },
    { path: "option1", label: "Option 1" },
    { path: "option2", label: "Option 2" },
    { path: "option3", label: "Option 3" },
  ];

  deleteColumn = {
    key: "delete",
    content: question => (
      <button
        onClick={() => this.props.onDelete(question)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const { questions, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={questions}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default QuestionsTable;
