# millionaire
Millionaire game DP task
# Clone from Github
clone https://github.com/harut17harut/millionaire.git
# install npm packages
npm install
# setup enviropments
create .env file in root directory and write on it default settings

PORT=3000
HOST=localhost
JWT_SECRET=asdfasdf

# Migrating and Seeding
npx sequelize-cli migrate
npx sequelize-cli seed:all

# Running the project
npm run dev

# Request examples
https://documenter.getpostman.com/view/18998337/UVRHjPh1

# Dependencies
bcrypt,
dotenv,
express,
express-validator,
jsonwebtoken,
mysql2,
nodemon,
sequelize
