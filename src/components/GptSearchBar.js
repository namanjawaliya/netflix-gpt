import React, { useRef, useState } from "react";
import { language } from "../utils/constants/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constants/constants";
import {
  addSearchResult,
  toggleGptSearchButton,
} from "../utils/store/gptSlice";
import ErrorMessage from "./ErrorMessage";
import SpinnerIcon from "./Icons/SpinnerIcon";

const GptSearchBar = () => {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState(null);

  const currentLanguage = useSelector((store) => store.config.language);
  const isSearchEnabled = useSelector((store) => store.gpt.isSearchEnabled);

  const { search, gptSearchPlaceholder: placeholder } =
    language[currentLanguage];

  const searchText = useRef(null);

  const searchMovie = async (name) => {
    try {
      const endpoint = `https://api.themoviedb.org/3/search/movie?query=${name}`;
      const response = await fetch(endpoint, API_OPTIONS);
      const json = await response.json();

      return json.results;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!isSearchEnabled) return;
    dispatch(toggleGptSearchButton());
    setErrorMessage(null);
    try {
      const query = `Act as a movie recommendation system and suggest some movies for the query ${searchText.current.value} only give me name of 5 movies separated by comma. No numbering is required. Just names, no list.`;

      const result = await openai.chat.completions.create({
        messages: [{ role: "user", content: query }],
        model: "gpt-3.5-turbo",
      });

      const movieNames = result.choices?.[0]?.message?.content.split(", ");
      const promiseArray = movieNames.map((el) => searchMovie(el));

      const movieResults = await Promise.all(promiseArray);
      dispatch(addSearchResult({ movieNames, movieResults }));
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      dispatch(toggleGptSearchButton());
    }
  };

  return (
    <div className="pt-[20%] md:pt-[10%] flex flex-col items-center justify-center">
      <form
        className="w-2/3 flex justify-center items-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="p-4 m-4 md:w-2/3 rounded"
          ref={searchText}
        />
        <button
          className="px-4 md:px-0 py-4 w-28 bg-red-500 hover:bg-red-600 text-white rounded disabled:bg-red-400"
          onClick={handleSearch}
          type="submit"
          disabled={!isSearchEnabled}
        >
          {
            <span className="flex justify-center items-center">
              {search}
              {!isSearchEnabled && <SpinnerIcon height={26} width={26} />}
            </span>
          }
        </button>
      </form>
      {errorMessage && (
        <div className="text-white bg-black opacity-70 w-full md:w-2/3 p-4">
          <ErrorMessage message={errorMessage} />
        </div>
      )}
    </div>
  );
};

export default GptSearchBar;
