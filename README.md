# Running

## Database Setup

`DB_USER` - database username
`DB_PASSWORD` - database password
`DB_NAME` - database name
`DB_HOST` - database address

if database is not created, you can provide the name through ENVs and run:
`npx sequelize db:create` so that it is created for you.

Once database is created (either by the command above or manually) please run:

`npx sequelize db:migrate`
