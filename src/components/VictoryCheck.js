import React from "react";

import VictoryMarkup from "./VictoryMarkup";

function VictoryCheck({ bingoBoxes }) {
  let box = [];
  for (let i = 0; i < bingoBoxes.length; i++) {
    box.push(bingoBoxes[i].checked);
  }

  let victoryMarkup;
  // Checks horizontal for bingo
  if (
    (box[0] && box[1] && box[2] && box[3] && box[4]) ||
    (box[5] && box[6] && box[7] && box[8] && box[9]) ||
    (box[10] && box[11] && box[12] && box[13] && box[14]) ||
    (box[15] && box[16] && box[17] && box[18] && box[19]) ||
    (box[20] && box[21] && box[22] && box[23] && box[24]) ||
    // Checks horizontal for bingo
    (box[0] && box[5] && box[10] && box[15] && box[20]) ||
    (box[1] && box[6] && box[11] && box[16] && box[21]) ||
    (box[2] && box[7] && box[12] && box[17] && box[22]) ||
    (box[3] && box[8] && box[13] && box[18] && box[23]) ||
    (box[4] && box[9] && box[14] && box[19] && box[24]) ||
    // Checks across for bingo
    (box[0] && box[6] && box[12] && box[18] && box[24]) ||
    (box[4] && box[8] && box[12] && box[16] && box[20])
  ) {
    victoryMarkup = <VictoryMarkup />;
  } else {
    victoryMarkup = <></>;
  }
  // TODO: Comfirm Bingo(add finishedAt time)

  return victoryMarkup;
}

export default VictoryCheck;
