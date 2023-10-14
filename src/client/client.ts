import BattleshipsEvent from './BattleshipsEvent'
import HitResult from '../common/HitResult'
import Render from './Render'
import Position from './Position'
import Point from './Point'
import Board from './Board'
import type Window from './types/index.d.ts'

window.onload = function() {
    console.log("gameId: " + window.gameId);

    window.render = new Render();

    window.socket = window.io()
    window.socket.on(BattleshipsEvent.EVENT_CHANNEL_NAME_SYSTEM, function(event) {
        switch (event.type) {
            case BattleshipsEvent.EVENT_TYPE_CONNECTED:
                window.playerId = event.playerId;
                const d = new Date();
                d.setTime(d.getTime() + (1*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = "playerId=" + window.playerId + ";" + expires + ";path=/";

                console.dir("connected to the server")

                const actionCanvas = document.getElementById("action-board");
                if (actionCanvas == null) {
                    throw Error("Can't find Action board");
                }
                const sheepsCanvas = document.getElementById("my-ships");
                if (actionCanvas == null) {
                    throw Error("Can't find Sheeps board");
                }

                const startPoint = new Point(40, 40);
                window.actionBoard = Board.initFromServerData(startPoint, 40, 1, event.shots_grid, true);
                window.render.drawBoard(actionCanvas, window.actionBoard);
                window.shipsBoard = Board.initFromServerData(startPoint, 40, 1, event.ships_grid, true);
                window.render.drawBoard(sheepsCanvas, window.shipsBoard);

                function getMousePoint(canvasRect, clientX, clientY) {
                    const x = clientX - canvasRect.left;
                    const y = clientY - canvasRect.top;
                    return new Point(x, y);
                }

                actionCanvas.addEventListener('mousemove', function(board, e) {
                    const rect = this.getBoundingClientRect();
                    const mousePoint = getMousePoint(rect, e.clientX, e.clientY);
                    board.mouseMove(mousePoint);
                    window.render.refreshGrid(this, board);
                }.bind(actionCanvas, window.actionBoard));

                actionCanvas.addEventListener('click', function(board, e) {
                    const rect = this.getBoundingClientRect();
                    const mousePoint = getMousePoint(rect, e.clientX, e.clientY);
                    board.mouseClick(mousePoint);
                    window.render.refreshGrid(this, board);
                }.bind(actionCanvas, window.actionBoard));
                break;
            default:
                throw new Error(`Unknown system event type(${event.type})`);
        }
    });

    window.socket.on(BattleshipsEvent.EVENT_CHANNEL_NAME_GAME, function(event) {
        switch (event.type) {
            case BattleshipsEvent.EVENT_TYPE_WAITING:
                console.log(`Waiting for the second player`)
                break
            case BattleshipsEvent.EVENT_TYPE_JOINED:
                console.log(`Player ${event.playerId} has joined the game`)
                break
            case BattleshipsEvent.EVENT_TYPE_LEFT:
                console.log(`Player ${event.playerId} has left the game`)
                break
            case BattleshipsEvent.EVENT_TYPE_ANNOUNCE:
                switch (event.result) {
                    case HitResult.HIT_RESULT_MISS:
                        console.log("miss")
                        break
                    case HitResult.HIT_RESULT_DAMAGE:
                        console.log("damage")
                        break
                    case HitResult.HIT_RESULT_SUNK:
                        console.log("sunk")
                        break
                    default:
                        throw new Error(`Unknown hit result(${event.result})`)
                }
                break
            case BattleshipsEvent.EVENT_TYPE_ROUND:
                for (const u in event.opponent_updates) {
                    const upd =  event.opponent_updates[u]
                    window.shipsBoard.setCellType(
                        new Position(upd.position.col, upd.position.row),
                        upd.type
                    )
                }
                window.render.refreshGrid(document.getElementById("my-ships"), window.shipsBoard)

                for (const u in event.player_updates) {
                    const upd =  event.player_updates[u]
                    window.actionBoard.setCellType(
                        new Position(upd.position.col, upd.position.row),
                        upd.type
                    )
                }
                window.render.refreshGrid(document.getElementById("action-board"), window.actionBoard)

                window.actionBoard.roundStart(event.number)
                break
            case BattleshipsEvent.EVENT_TYPE_WIN:
                console.log("Win")
                break
            case BattleshipsEvent.EVENT_TYPE_DEFEAT:
                console.log("Defeat")
                break
            case BattleshipsEvent.EVENT_TYPE_DRAW:
                console.log("Draw")
                break
            default:
                throw new Error(`Unknown game event type(${event.type})`)
        }
    })
}