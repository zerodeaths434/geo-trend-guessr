import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ReactTooltip from "react-tooltip";
import Modal from "./Modal";
import CorrectCountry from "./correctCountry";
import PlayAgain from "./playAgain";
import Globle from "./globe";
import { useGlobalContext } from "./context";

let socket;
const ENDPOINT = "https://geo-trend-guessr.herokuapp.com/";

const getWord = () => {
  socket.emit("getWord");
};

const Game = () => {
  const [word, setWord] = useState("");
  const [country, setCountry] = useState("");
  const [content, setContent] = useState("");
  const [tries, setNoOFTries] = useState(0);
  const { openModal, isModalOpen, closeModal, wordNum } = useGlobalContext();

  useEffect(() => {
    if (isModalOpen) {
      const interval = setInterval(closeModal, 2000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    socket = io(ENDPOINT);
    getWord();
  }, []);

  useEffect(() => {
    socket.on("receiveWord", (currentWord, currentCountry) => {
      setWord(currentWord);
      setCountry(currentCountry);
      openModal();
    });
    return () => {
      socket.off();
    };
  }, [openModal]);

  return (
    <>
      {tries === 3 ? <CorrectCountry country={country} /> : null}
      {isModalOpen ? <Modal word={word} /> : null}
      {wordNum > 0 ? (
        <>
          {/*<MapChart
            tries={tries}
            setTries={setNoOFTries}
            getWord={getWord}
            setTooltipContent={setContent}
            country={country}
      />*/}
          <Globle
            tries={tries}
            setTries={setNoOFTries}
            getWord={getWord}
            country={country}
          />
          <ReactTooltip>{content}</ReactTooltip>
        </>
      ) : (
        <PlayAgain />
      )}
    </>
  );
};

export default Game;
