# Robotron 9000 🤖

## Requirements

The below requirements are needed for this project

- Docker
- Docker Compose
- Make (available on all linux distros and MacOS)
- Node 16

If you need to install Node 16, you can install using nvm (`nvm install lts/gallium`)

## Getting started

Run `make` to see the full list of commands available

```bash
make
```

Prep the local environment to run the app

```bash
make build
```

After this, you can start the application locally in dev mode. CTRL + C will exit the process

```bash
make start
```

To shutdown supporting services, run:

```bash
make stop
```

To run the test suite:

```bash
make tests
```

## API Endpoints

Once the service has started, you have the following endpoints available for you

### List Robots
```
[GET] http://localhost:3000/api/robots
```

### Create Robot
```
[POST] http://localhost:3000/api/robots
```

This will create a new robot and place it in the far north-west corner of the warehouse. If a bot is currently sitting in that square, the request will fail.

### Move Robot
```
[POST] http://localhost:3000/api/robots/{ROBOT_ID}/move/{DIRECTION}
```

This will let you move a robot in an allowed direction (`N`, `S`, `E` or `W`). If a bot is currently sitting in that square, the request will fail. 

### Bulk Move Robot
```
[POST] http://localhost:3000/api/robots/{ROBOT_ID}/move

Body {
    movements: "N S E W"
}
```

This will let you move a robot in a set of allowed directions.

Rules:
- `movements` must be a string containing only valid directions (`N`, `S`, `E` or `W`)
- directions must be delineated by a space
- Multiple spaces and lowercase directions are allowed, they will be sanitised
- If an invalid direction is encountered, the movement set will not be processed
- If a direction in the set would send the robot out of bounds, the movement set will not be processed
- If a collision with another robot would occur as part o the set, the movement set will not be processed.
