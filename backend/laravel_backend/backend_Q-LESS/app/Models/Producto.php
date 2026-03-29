<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'image_path',
        'user_id'
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }
        
        $parts = explode('/', $this->image_path);
        $folder = $parts[0] ?? 'products';
        $file = $parts[1] ?? $this->image_path;
        
        return route('storage.file', ['folder' => $folder, 'file' => $file]);
    }

    public static function mapInput(array $data): array
    {
        return [
            'nombre' => $data['nombre'] ?? $data['name'] ?? null,
            'descripcion' => $data['descripcion'] ?? $data['description'] ?? null,
            'precio' => $data['precio'] ?? $data['price'] ?? null,
            'stock' => $data['stock'] ?? $data['stock'] ?? null,
            'image_path' => $data['image_path'] ?? $data['image_path'] ?? null,
            'user_id' => $data['user_id'] ?? $data['user_id'] ?? null,
        ];
    }

    public function toArray(): array
    {
        $array = parent::toArray();
        $array['nombre'] = $array['nombre'] ?? null;
        $array['descripcion'] = $array['descripcion'] ?? null;
        $array['precio'] = $array['precio'] ?? null;
        $array['image_path'] = $this->image_url;
        $array['user_id'] = $array['user_id'] ?? null;
        return $array;
    }
}
