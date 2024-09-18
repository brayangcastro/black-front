// Bracket.jsx
import React from 'react';
import './Bracket.css'; // Asegúrate de que este archivo CSS está bien definido y en la ruta correcta

const Bracket = ({ tournamentData }) => {
  return (
    <div className="bracket">
      {tournamentData.rounds.map((round, index) => (
        <div key={index} className="bracket-round">
          <div className="round-title">Ronda {round.roundNumber}</div>
          {round.matches.map((match, matchIndex) => (
            <div key={matchIndex} className="bracket-match">
              {match.teams.map((team, teamIndex) => (
                <div key={teamIndex} className={`team ${match.winner === team ? 'winner' : ''}`}>
                  {team}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Bracket;