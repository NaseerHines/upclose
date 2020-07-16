import React, { FC, ReactElement } from 'react';

import Player from './Player';

import {
  User,
  roomSize,
  dir,
  Direction,
  RoomStyles,
} from '../services/constants';

import PartyGoer from './PartyGoer';

interface RoomProps {
  name: 'red' | 'green' | 'blue' | 'yellow';
  changeRoom: (dir: dir) => void;
  user: User;
  socket: SocketIOClient.Socket;
  positions: any;
  setPositions: any;
}

const Room: FC<RoomProps> = ({
  name,
  changeRoom,
  socket,
  positions,
  setPositions,
}): ReactElement => {
  const emitPosition = (newPlayerPosition: any) => {
    socket.emit('player moved', { [socket.id]: newPlayerPosition });
  };

  const handlePlayerMovement = (direction: Direction) => {
    // existing coordinates
    const playerPosition = positions[socket.id];
    const { top, left } = playerPosition;

    // boundary movement
    switch (direction.dir) {
      case 'UP':
        if (top <= 0) {
          playerPosition.top = top + roomSize;
          changeRoom('UP');
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      case 'DOWN':
        if (top >= roomSize - 40) {
          playerPosition.top = top - roomSize;
          changeRoom('DOWN');
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      case 'LEFT':
        if (left <= 0) {
          playerPosition.left = left + roomSize;
          changeRoom('LEFT');
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      case 'RIGHT':
        if (left >= roomSize - 40) {
          playerPosition.left = left - roomSize;
          changeRoom('RIGHT');
          emitPosition(playerPosition);
          setPositions({ ...positions });
          return;
        }
        break;
      default:
        break;
    }

    // normal field movement
    playerPosition.top = top + 5 * direction.top;
    playerPosition.left = left + 5 * direction.left;
    emitPosition(playerPosition);
    setPositions({ ...positions });
  };

  return (
    <div className={`relative w-full h-full inline-block ${RoomStyles[name]}`}>
      <Player position={positions[socket.id]} handlePlayerMovement={handlePlayerMovement} />
      {Object.keys(positions).filter(socketId => socketId !== socket.id).map((socketId, i) => {
        return (
          <PartyGoer key={socketId} position={positions[socketId]} calibration={(i + 1) * 40} />
        );
      })}
    </div>
  );
};

export default Room;
