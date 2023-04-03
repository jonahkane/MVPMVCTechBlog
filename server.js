const express = require('express');
const exphbs = require('express-handlebars');
const mysql2 = require('mysql2');
const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const bcrypt = require('bcrypt');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
