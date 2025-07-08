const express = require('express')
const users = require('../routes/users');
const login = require('../routes/login');
const dashboard = require('../routes/dashboard');
const refreshToken = require('../routes/refresh-token');
const logout = require('../routes/logout');
const forgotPassword = require('../routes/forgot-password');
const resetPassword = require('../routes/reset-password');
const admin = require('../routes/admin');
const changePassword = require('../routes/change-password');


module.exports = function(app){
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/login', login);
    app.use('/api/dashboard', dashboard);
    app.use('/api/refresh-token', refreshToken);
    app.use('/api/logout', logout);
    app.use('/api/forgot-password', forgotPassword);
    app.use('/api/reset-password', resetPassword);
    app.use('/api/admin/users', admin);
    app.use('/api/change-password', changePassword);
}