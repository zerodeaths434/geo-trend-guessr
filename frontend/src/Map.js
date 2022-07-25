import React, { memo } from "react";
import { useGlobalContext } from "./context";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const correctSound = () => {
  document.getElementById("Correctaudio").play();
};

const WrongSound = () => {
  document.getElementById("Wrongaudio").play();
};

const MapChart = ({ country, setTooltipContent, getWord, tries, setTries }) => {
  const { changeTheme, setWordNum, setScore } = useGlobalContext();

  return (
    <>
      <button className="dark-mode" onClick={changeTheme}>
        Toggle Mode
      </button>
      <ComposableMap
        height={302} //200
        width={620} //620
        data-tip=""
        projectionConfig={{ scale: 100 }} //70
      >
        <ZoomableGroup center={[0, 0]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME, POP_EST } = geo.properties;
                    setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  onClick={() => {
                    const { NAME_LONG, NAME } = geo.properties;
                    if (NAME_LONG === country || NAME === country) {
                      correctSound();
                      setScore((score) => score + 1);
                      setWordNum((abc) => abc - 1);
                      getWord();
                    } else {
                      setTries((tries) => tries + 1);
                      WrongSound();
                      if (tries === 2) {
                        setTimeout(() => {
                          setTries(0);
                          setWordNum((abc) => abc - 1);
                          getWord();
                        }, 2000);
                      }
                    }
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
