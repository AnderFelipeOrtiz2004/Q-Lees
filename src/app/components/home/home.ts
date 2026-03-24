import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.js';
import { ProductService } from '../../services/product.service.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  userName: string | null = '';
  loggedUserId: number | null = null;
  productos: any[] = [];
  hasProductos = false;
  searchText = '';
  newProduct: any = { name: '', description: '', price: null, stock: null };
  editingId: number | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('user_name') || 'Aprendiz';

    const userIdValue = localStorage.getItem('user_id');
    this.loggedUserId = userIdValue ? Number(userIdValue) : null;

    this.loadProducts();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/home' || event.urlAfterRedirects === '/home') {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (response: any) => {
        const data = Array.isArray(response) ? response : response?.data || [];
        this.productos = data;
        this.hasProductos = this.productos.length > 0;
      },
      error => {
        console.error('Error cargando productos', error);
        // Mantener productos actuales si ya estaban cargados
        if (this.productos.length === 0) {
          this.hasProductos = false;
        } else {
          this.hasProductos = true;
        }
      }
    );
  }

  get filteredProducts(): any[] {
    if (!this.searchText?.trim()) {
      return this.productos;
    }
    const term = this.searchText.toLowerCase();
    return this.productos.filter(p => {
      return (
        (p.nombre && p.nombre.toLowerCase().includes(term)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(term))
      );
    });
  }

  getImageUrl(product: any): string {
    if (!product || !product.image_path) {
      return 'assets/placeholder.png';
    }
    if (product.image_path.startsWith('http')) {
      return product.image_path;
    }
    const normalized = product.image_path.replace(/^\//, '');
    return `http://127.0.0.1:8000/storage/${normalized}`;
  }

  esDueno(producto: any): boolean {
    if (!producto) {
      return false;
    }
    return Number(producto.user_id) === this.loggedUserId;
  }


  saveProduct(): void {
    if (this.editingId !== null) {
      this.productService.updateProduct(this.editingId, this.newProduct).subscribe(
        () => {
          this.resetProductForm();
          this.loadProducts(); 
        },
        error => {
          console.error('Error actualizando producto', error);
        }
      );
      return;
    }

    this.productService.createProduct(this.newProduct).subscribe(
      () => {
        this.resetProductForm();
        this.loadProducts(); 
      },
      error => {
        console.error('Error creando producto', error);
      }
    );
  }

  editProduct(product: any): void {
    this.editingId = product.id;
    this.newProduct = { ...product };
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.loadProducts();
      },
      error => {
        console.error('Error eliminando producto', error);
      }
    );
  }

  eliminar(id: number): void {
    this.deleteProduct(id);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  resetProductForm(): void {
    this.editingId = null;
    this.newProduct = { name: '', description: '', price: null, stock: null };
  }
}