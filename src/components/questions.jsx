import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import QuestionsTable from "./questionsTable";
import Pagination from "./common/pagination";
import { deleteQuestion, getQuestions} from "../services/questionService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Questions extends Component {
  state = {
    questions: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    const {data : questions} = await getQuestions();
    this.setState({ questions });
  }

  handleDelete = async question => {
    const originalQuestions = this.state.questions;
    const questions = originalQuestions.filter(q => q._id !== question._id);
    this.setState({ questions });

    try {
      await deleteQuestion(question._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This question has already been deleted.");

      this.setState({ questions: originalQuestions });
    }
  };


  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      questions: allQuestions
    } = this.state;

    let filtered = allQuestions;
    if (searchQuery)
      filtered = allQuestions.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const questions = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: questions };
  };

  render() {
    const { length: count } = this.state.questions;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no questions in the database.</p>;

    const { totalCount, data: questions } = this.getPagedData();

    return (
      <div className="row">
        {/* <div className="col-3">
        </div> */}
        <div className="col">
          {user && (
            <Link
              to="/questions/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Question
            </Link>
          )}
          <p>Showing {totalCount} questions in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <QuestionsTable
            questions={questions}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Questions;
