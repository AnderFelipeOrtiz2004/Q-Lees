<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importamos todos los controladores necesarios
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\ProductoController;

/*
|--------------------------------------------------------------------------
| Rutas Públicas (Cualquiera puede acceder)
|--------------------------------------------------------------------------
*/

// Registro y Login para estudiantes y admin
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login']);

// Ver productos (para que los estudiantes vean el catálogo de la papelería)
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);


/*
|--------------------------------------------------------------------------
| Rutas Protegidas (Solo con Token de Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Cerrar sesión de forma segura
    Route::post('/logout', [LogoutController::class, 'logout']);

    // Gestión de inventario (Crear, Editar, Borrar productos)
    // Solo accesible si el usuario está logueado
    Route::post('/productos', [ProductoController::class, 'store']);
    Route::put('/productos/{id}', [ProductoController::class, 'update']);
    Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

});