import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-edit-product",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./edit-product.html",
  styleUrl: "./edit-product.css",
})
export class EditProduct implements OnInit {
  productId: string | null = null;
  product: any = {
    id: null,
    nombre: '',
    descripcion: '',
    precio: null,
    stock: null,
    image_path: ''
  };
  originalProduct: any = {};
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  isLoading = false;
  errors: { type: string; message: string }[] = [];
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
    }
  }

  clearErrors(): void {
    this.errors = [];
  }

  addError(type: string, message: string): void {
    this.errors.push({ type, message });
  }

  loadProduct(): void {
    this.productService.getProducts().subscribe(
      (response: any) => {
        const products = response?.data || [];
        const found = products.find((p: any) => p.id == this.productId);
        if (found) {
          this.product = {
            id: found.id,
            nombre: found.nombre,
            descripcion: found.descripcion,
            precio: found.precio,
            stock: found.stock,
            image_path: found.image_path
          };
          this.originalProduct = { ...this.product };
        } else {
          this.addError('danger', 'No se encontró el producto');
        }
      },
      error => {
        console.error('Error cargando producto', error);
        this.addError('danger', 'Error al cargar el producto. Intenta de nuevo.');
      }
    );
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = [];
      this.previewUrls = [];
      this.clearErrors();

      for (const file of files) {
        const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!validTypes.includes(file.type)) {
          this.addError('warning', `${file.name} no es válido. Solo PNG, JPG o JPEG`);
          continue;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          const sizeMB = (file.size / 1024 / 1024).toFixed(2);
          this.addError('warning', `${file.name} pesa ${sizeMB}MB. Máximo 5MB`);
          continue;
        }

        this.selectedFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.previewUrls.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }

      if (this.selectedFiles.length > 0) {
        this.addError('success', `${this.selectedFiles.length} imagen(es) cargada(s) correctamente`);
      }
    }
  }

  removeSelectedImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  validateForm(): boolean {
    this.clearErrors();
    let isValid = true;

    if (!this.product.nombre.trim()) {
      this.addError('danger', 'El nombre del producto es requerido');
      isValid = false;
    }

    if (!this.product.descripcion.trim()) {
      this.addError('danger', 'La descripción es requerida');
      isValid = false;
    }

    if (this.product.precio === null || this.product.precio === undefined) {
      this.addError('danger', 'El precio es requerido');
      isValid = false;
    } else if (this.product.precio <= 0) {
      this.addError('danger', 'El precio debe ser mayor a 0');
      isValid = false;
    }

    if (this.product.stock === null || this.product.stock === undefined) {
      this.addError('danger', 'El stock es requerido');
      isValid = false;
    } else if (this.product.stock < 0) {
      this.addError('danger', 'El stock no puede ser negativo');
      isValid = false;
    }

    return isValid;
  }

  updateProduct(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append('nombre', this.product.nombre);
      formData.append('descripcion', this.product.descripcion);
      formData.append('precio', String(this.product.precio));
      formData.append('stock', String(this.product.stock));
      formData.append('_method', 'PUT');

      this.selectedFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file, file.name);
      });

      if (this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe(
          () => {
            this.isLoading = false;
            this.successMessage = 'Producto actualizado correctamente. Redirigiendo...';
            setTimeout(() => {
              this.router.navigate(['/home']).then(() => {
                window.location.reload();
              });
            }, 1500);
          },
          (error) => {
            this.isLoading = false;
            console.error('Error actualizando producto', error);
            
            if (error?.status === 422) {
              if (error?.error?.errors?.nombre) {
                this.addError('danger', 'Ya existe un producto con este nombre');
              } else if (error?.error?.errors?.precio) {
                this.addError('danger', 'El formato del precio no es válido');
              } else if (error?.error?.errors?.images) {
                this.addError('danger', 'Hubo un error al procesar las imágenes');
              } else if (error?.error?.message) {
                this.addError('danger', error.error.message);
              } else {
                this.addError('danger', 'Datos inválidos. Revisa los campos');
              }
            } else if (error?.status === 0) {
              this.addError('danger', 'No se pudo conectar al servidor');
            } else if (error?.status === 500) {
              this.addError('danger', 'Error del servidor. Intenta más tarde');
            } else if (error?.error?.message) {
              this.addError('danger', error.error.message);
            } else {
              this.addError('danger', 'Error al actualizar el producto');
            }
          }
        );
      }
    } else {
      const updateData = {
        nombre: this.product.nombre,
        descripcion: this.product.descripcion,
        precio: this.product.precio,
        stock: this.product.stock
      };

      if (this.productId) {
        this.productService.updateProduct(this.productId, updateData).subscribe(
          () => {
            this.isLoading = false;
            this.successMessage = 'Producto actualizado correctamente. Redirigiendo...';
            setTimeout(() => {
              this.router.navigate(['/home']).then(() => {
                window.location.reload();
              });
            }, 1500);
          },
          (error) => {
            this.isLoading = false;
            console.error('Error actualizando producto', error);
            
            if (error?.status === 422) {
              if (error?.error?.errors?.nombre) {
                this.addError('danger', 'Ya existe un producto con este nombre');
              } else if (error?.error?.errors?.precio) {
                this.addError('danger', 'El formato del precio no es válido');
              } else if (error?.error?.message) {
                this.addError('danger', error.error.message);
              } else {
                this.addError('danger', 'Datos inválidos. Revisa los campos');
              }
            } else if (error?.status === 0) {
              this.addError('danger', 'No se pudo conectar al servidor');
            } else if (error?.status === 500) {
              this.addError('danger', 'Error del servidor. Intenta más tarde');
            } else if (error?.error?.message) {
              this.addError('danger', error.error.message);
            } else {
              this.addError('danger', 'Error al actualizar el producto');
            }
          }
        );
      }
    }
  }

  deleteProduct(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.isLoading = true;
      if (this.productId) {
        this.productService.deleteProduct(this.productId).subscribe(
          () => {
            this.isLoading = false;
            this.successMessage = 'Producto eliminado correctamente. Redirigiendo...';
            setTimeout(() => {
              this.router.navigate(['/home']).then(() => {
                window.location.reload();
              });
            }, 1500);
          },
          (error) => {
            this.isLoading = false;
            console.error('Error eliminando producto', error);
            
            if (error?.status === 0) {
              this.addError('danger', 'No se pudo conectar al servidor');
            } else if (error?.status === 500) {
              this.addError('danger', 'Error del servidor al eliminar');
            } else if (error?.error?.message) {
              this.addError('danger', error.error.message);
            } else {
              this.addError('danger', 'Error al eliminar el producto');
            }
          }
        );
      }
    }
  }

  removeCurrentImage(): void {
    this.product.image_path = '';
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
