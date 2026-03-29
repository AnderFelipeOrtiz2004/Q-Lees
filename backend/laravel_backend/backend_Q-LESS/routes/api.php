<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/* | Importante: El namespace debe coincidir con la carpeta. 
| Si tu carpeta es 'auth' (minúscula), el 'use' debe ser así:
*/
use App\Http\Controllers\auth\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Proyecto Q-LESS
|--------------------------------------------------------------------------
*/

Route::get('/users', [AuthController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::delete('/users/{id}', [AuthController::class, 'destroy']);

Route::get('/status', function () {
    return response()->json(['message' => 'Backend de Q-LESS conectado correctamente'], 200);
});

use App\Http\Controllers\ProductController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});