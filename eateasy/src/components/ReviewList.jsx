import { useQuery } from "@tanstack/react-query";
import { getAllReviews, deleteReview, queryClient } from "../util/Http";
import { useSelector } from "react-redux";
import ReviewForm from "./ReviewForm";
import { useState } from "react";

const ReviewList = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [mode, setMode] = useState("");
  const [desc, setDesc] = useState("");
  const [rating, setRating] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ["review"],
    queryFn: getAllReviews,
  });

  const deleteHandler = async (id) => {
    await deleteReview(id);
    queryClient.refetchQueries(["review"]);
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      <div className="w-full max-w-xl my-8 bg-white shadow-md rounded-lg p-4 text-center">
        {data &&
          data.map((review) => (
            <div key={review._id} className="p-4 border-b border-gray-200">
              <div className="flex justify-between">
                <p className="font-semibold">{review.user.username}</p>
                <p className="text-gray-500">{review.createdAt}</p>
                <p className="text-gray-500">Rating: {review.rating} / 5</p>
              </div>
              <p className="text-lg font-medium mt-4  break-words">{review.text}</p>

              {currentUser?._id === review.user._id && (
                <div className="flex justify-end">
                  <button
                    className="text-blue-500 hover:text-blue-600 mr-4"
                    onClick={() => {
                      setMode("update");
                      setReviewId(review._id);
                      setDesc(review.text);
                      setRating(review.rating);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      deleteHandler(review._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
      {currentUser && (
        <>
          {mode !== "create" && (
            <button
              onClick={() => setMode("create")}
              className="text-green-500  hover:text-green-700 border-2 rounded-sm p-2 mb-4 hover:bg-teal-100"
            >
              Create a Review
            </button>
          )}

          {mode !== "" && (
            <ReviewForm mode={mode} reviewId={reviewId} desc={desc} rating={Number(rating)} />
          )}
        </>
      )}
    </>
  );
};

export default ReviewList;
