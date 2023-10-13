declare global {
    interface Window {
        gameId: string
        playerId: string
        socket: any
        render: any
        io: any
        actionBoard: any
        shipsBoard: any
    }
}

export default Window