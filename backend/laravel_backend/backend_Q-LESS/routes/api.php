<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ProductoController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::post('/chatbot/recomendar', [ChatbotController::class, 'recommend']);
Route::apiResource('productos', ProductoController::class);
