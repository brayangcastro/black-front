import React from 'react';

const Round = ({ round }) => {
  return (
    <div className="round">
      <h2>Ronda {round.roundNumber}</h2>
      {round.matches.map((match, index) => (
        <div key={index} className="match">
          {match.teams.map((team, teamIndex) => (
            <div key={teamIndex} className={`team ${match.winner === team ? 'winner' : ''}`}>
              {team || "TBD"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Round;
