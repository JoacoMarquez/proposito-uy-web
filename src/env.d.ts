declare namespace App {
  interface Locals {
    adminUser: { id: number; email: string } | null;
    cliente: { id: number; email: string; nombre: string } | null;
  }
}
