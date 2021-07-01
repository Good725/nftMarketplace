import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function PackEditionsRemaining({ index }) {
  const packInfo = useSelector((state) => state.pack.packInfo);
  const [percentChance, setPercentChance] = useState('');

  useEffect(() => {
    packInfo.remainingCards &&
      setPercentChance(
        (
          (packInfo.remainingCards[index].editions.length /
            packInfo.totalEditions) *
          100
        ).toFixed(2)
      );
  }, [packInfo]);
  return (
    <div>
      <p>Percentage of getting above card {percentChance}%</p>
      <p>Editions Remaining</p>
      <select>
        {packInfo.remainingCards &&
          packInfo.remainingCards[index].editions.map((item) => (
            <option key={item.key}>{item}</option>
          ))}
      </select>
    </div>
  );
}

export default PackEditionsRemaining;
