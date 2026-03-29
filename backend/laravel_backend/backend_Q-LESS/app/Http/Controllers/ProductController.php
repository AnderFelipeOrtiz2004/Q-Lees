<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Producto as Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
   
    public function index(): JsonResponse
    {
        $products = Product::all()->map(function ($product) {
            return [
                'id' => $product->id,
                'nombre' => $product->nombre,
                'descripcion' => $product->descripcion,
                'precio' => $product->precio,
                'stock' => $product->stock,
                'image_path' => $product->image_url,
                'user_id' => $product->user_id,
            ];
        });

        return response()->json([ 'status' => 'success', 'data' => $products ], 200);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'descripcion' => 'required|string|max:1000',
                'precio' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($request->hasFile('image')) {
                $path = Storage::disk('public')->putFile('products', $request->file('image'));
                $validated['image_path'] = $path;
            }

            $validated['user_id'] = $request->user()->id;

            $product = Product::create(Product::mapInput($validated));

            return response()->json([ 'status' => 'success', 'data' => $product->toArray() ], 201);
        } catch (\Exception $e) {
            return response()->json([ 'status' => 'error', 'message' => $e->getMessage() ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $product = Product::findOrFail($id);

            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'descripcion' => 'sometimes|string|max:1000',
                'precio' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|string|max:1000',
                'price' => 'sometimes|numeric|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'images' => 'nullable|array',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if ($request->hasFile('image')) {
                $path = Storage::disk('public')->putFile('products', $request->file('image'));
                $validated['image_path'] = $path;
            }

            if ($request->hasFile('images')) {
                $path = Storage::disk('public')->putFile('products', $request->file('images')[0]);
                $validated['image_path'] = $path;
            }

            $nombre = $validated['nombre'] ?? $validated['name'] ?? null;
            $descripcion = $validated['descripcion'] ?? $validated['description'] ?? null;
            $precio = $validated['precio'] ?? $validated['price'] ?? null;
            $stock = $validated['stock'] ?? null;

            $updateData = [];
            if ($nombre) $updateData['nombre'] = $nombre;
            if ($descripcion) $updateData['descripcion'] = $descripcion;
            if ($precio !== null) $updateData['precio'] = $precio;
            if ($stock !== null) $updateData['stock'] = $stock;
            if (isset($validated['image_path'])) $updateData['image_path'] = $validated['image_path'];

            $product->update($updateData);
            $product->refresh();

            return response()->json([ 'status' => 'success', 'data' => $product->toArray() ], 200);
        } catch (\Exception $e) {
            return response()->json([ 'status' => 'error', 'message' => $e->getMessage() ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([ 'status' => 'success', 'data' => [ 'id' => $id, 'message' => 'Producto eliminado' ] ], 200);
    }
}
