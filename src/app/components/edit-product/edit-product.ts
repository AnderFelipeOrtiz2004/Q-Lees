import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-edit-product",
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: "./edit-product.html",
  styleUrl: "./edit-product.css",
})
export class EditProduct implements OnInit {
  productId: string | null = null;
  product: any = {
    name: '',
    description: '',
    price: null,
    stock: null,
    image_path: ''
  };

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

  loadProduct(): void {

    this.productService.getProducts().subscribe(
      (response: any) => {
        const products = response?.data || [];
        const found = products.find((p: any) => p.id == this.productId);
        if (found) {
          this.product = { ...found };
        }
      },
      error => {
        console.error('Error cargando producto', error);
      }
    );
  }

  updateProduct(): void {
    if (this.productId) {
      this.productService.updateProduct(this.productId, this.product).subscribe(
        () => {
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error => {
          console.error('Error actualizando producto', error);
        }
      );
    }
  }

  deleteProduct(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      if (this.productId) {
        this.productService.deleteProduct(this.productId).subscribe(
          () => {
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          },
          error => {
            console.error('Error eliminando producto', error);
          }
        );
      }
    }
  }
}
