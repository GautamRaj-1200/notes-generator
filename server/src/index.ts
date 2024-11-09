import express, { Express, Request, Response, NextFunction } from "express"
const app: Express = express()

const PORT = 5500

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("<h1>Hello</h1>");
})

app.listen(PORT, () => {
    console.log("Server is running at port ", PORT)
})