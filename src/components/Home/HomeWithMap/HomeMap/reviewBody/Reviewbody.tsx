import React from "react";
import "./style.css";
import Rating from "react-rating";
import { DogsDB } from "../../../../../interfaces/dogsDB";
import { reviewDB } from "../../../../../interfaces/reviewDB";
const GET_DOG_INFO = "http://localhost:3000/dog/getDogInfo/";

interface IProps {
  review: reviewDB;
}

interface IState {
  dog: DogsDB;
}

class ReviewBody extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      dog: {
        breed: "",
        description: "",
        id: 0,
        name: "",
        photo: "",
        sex: "",
        user_id: 0
      }
    };
  }
  getDogInfo = async () => {
    const { dog_id } = this.props.review;
    await fetch(`${GET_DOG_INFO}${dog_id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json"
      })
    }).then(async response => {
      const json = await response.json();
      this.setState({ ...this.state, dog: json });
    });
  };

  componentDidMount() {
    setTimeout(() => {
      this.getDogInfo();
    }, 1);
  }

  render() {
    return (
      <div className="row mt-3">
        <div
          className="col-1 dogImage"
          style={{
            backgroundImage: `url(http://localhost:3000/public/dogPhoto/${this.state.dog.photo})`
          }}
        />
        <div className="col-2">{this.state.dog.name}</div>
        <div className="col-5">{this.props.review.review}</div>
        <div className="col-2">
          {new Date(this.props.review.reviewDate).toLocaleDateString()}
        </div>
        <div className="col-3 my-2">
          <Rating
            readonly
            className="ratingStars mr-2"
            emptySymbol="fa fa-star-o fa-2x"
            fullSymbol="fa fa-star fa-2x"
            fractions={2}
            initialRating={this.props.review.stars}
          />
        </div>
      </div>
    );
  }
}

export default ReviewBody;
