<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; 

class LoginController extends Controller
{

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

    
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            
         
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login exitoso',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);
        }

    
        return response()->json([
            'message' => 'Las credenciales no coinciden con nuestros registros.'
        ], 401);
    }

    public function logout(Request $request)
    {
     
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Has cerrado sesión correctamente'
        ], 200);
    }
}