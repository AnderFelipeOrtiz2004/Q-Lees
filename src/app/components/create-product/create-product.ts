import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-create-product",
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: "./create-product.html",
  styleUrl: "./create-product.css",
})
export class CreateProduct {
  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  selectedFile: File | null = null;

  constructor(private productService: ProductService, private router: Router) {}


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  saveProduct(): void {
    const formData = new FormData();
    formData.append('nombre', this.name);
    formData.append('descripcion', this.description);
    formData.append('precio', String(this.price ?? 0));
    formData.append('stock', String(this.stock ?? 0));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.productService.createProduct(formData).subscribe(
      () => {
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        console.error('Error creando producto', error);
      }
    );
  }
}
