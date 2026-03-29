<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validamos los datos que vienen de Angular/Thunder Client
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. Intentamos iniciar sesión
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
            // 3. Devolvemos JSON (Esto es lo que Angular necesita para ir al Home)
            return response()->json([
                'status' => true,
                'message' => '¡Bienvenido a Q-LESS!',
                'user' => $user,
                'redirect' => '/home' 
            ], 200);
        }

        // 4. Si falla, devolvemos error en JSON
        return response()->json([
            'status' => false,
            'message' => 'Las credenciales no coinciden con nuestros registros.'
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}