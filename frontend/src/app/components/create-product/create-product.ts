import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-create-product",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./create-product.html",
  styleUrl: "./create-product.css",
})
export class CreateProduct {
  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  errors: { type: string; message: string }[] = [];
  isLoading = false;

  constructor(private productService: ProductService, private router: Router) {}

  clearErrors(): void {
    this.errors = [];
  }

  addError(type: string, message: string): void {
    this.errors.push({ type, message });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.clearErrors();
      
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      
      if (!validTypes.includes(file.type)) {
        this.addError('warning', 'Tipo de imagen inválido. Solo se permiten PNG, JPG o JPEG');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.addError('warning', 'La imagen no debe exceder 5MB. Tu archivo pesa: ' + (file.size / 1024 / 1024).toFixed(2) + 'MB');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.imagePreview = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
      
      this.clearErrors();
      this.addError('success', 'Imagen cargada correctamente');
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    if (!this.name.trim()) {
      this.addError('danger', 'El nombre del producto es requerido');
      isValid = false;
    }

    if (!this.description.trim()) {
      this.addError('danger', 'La descripción es requerida');
      isValid = false;
    }

    if (this.price === null || this.price === undefined) {
      this.addError('danger', 'El precio es requerido');
      isValid = false;
    } else if (this.price <= 0) {
      this.addError('danger', 'El precio debe ser mayor a 0');
      isValid = false;
    }

    if (this.stock === null || this.stock === undefined) {
      this.addError('danger', 'El stock es requerido');
      isValid = false;
    } else if (this.stock < 0) {
      this.addError('danger', 'El stock no puede ser negativo');
      isValid = false;
    }

    if (!this.selectedFile) {
      this.addError('danger', 'Debes seleccionar una imagen para el producto');
      isValid = false;
    }

    return isValid;
  }

  saveProduct(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.clearErrors();
    
    const formData = new FormData();
    formData.append('nombre', this.name);
    formData.append('descripcion', this.description);
    formData.append('precio', String(this.price));
    formData.append('stock', String(this.stock));
    formData.append('image', this.selectedFile!, this.selectedFile!.name);

    this.productService.createProduct(formData).subscribe(
      (response) => {
        this.isLoading = false;
        this.addError('success', 'Producto creado exitosamente! Redirigiendo...');
        setTimeout(() => {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        }, 1500);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error creando producto', error);
        
        if (error?.status === 422) {
          if (error?.error?.errors?.nombre) {
            this.addError('danger', 'Ya existe un producto con este nombre');
          } else if (error?.error?.errors?.precio) {
            this.addError('danger', 'El formato del precio no es válido');
          } else if (error?.error?.errors?.image) {
            this.addError('danger', 'Hubo un error al procesar la imagen');
          } else if (error?.error?.message) {
            this.addError('danger', error.error.message);
          } else {
            this.addError('danger', 'Datos inválidos. Revisa los campos');
          }
        } else if (error?.status === 0) {
          this.addError('danger', 'No se pudo conectar al servidor. Verifica que esté activo.');
        } else if (error?.status === 500) {
          this.addError('danger', 'Error del servidor. Intenta de nuevo más tarde.');
        } else if (error?.error?.message) {
          this.addError('danger', error.error.message);
        } else {
          this.addError('danger', 'Error al crear el producto. Intenta de nuevo.');
        }
      }
    );
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
