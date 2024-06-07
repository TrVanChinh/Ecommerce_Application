import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/Core/Service/category.service';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  FormProduct!: FormGroup;
  URLImg: string[] = [];
  selectedImages: string[] = [];
  selectedImagesOption: string[] = [];
  selectedImage: string = ''; 
  DataCategory: any;
  categoryID: string = '';
  subcategoryID: string = '';

  toppings = new FormControl();
  nameCategorySelect: string = '';

  constructor(
    private productSevice: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private toast:ToastrService
  ) {
    this.FormProduct = this.fb.group({
      name: '',
      description: '',
      image: [''],
      options: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe((res) => {
      this.DataCategory = res.data;
    });
  }

  get options(): FormArray {
    return this.FormProduct.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(this.fb.group({
      imageUrl: '',
      name: '',
      price: '',
      quantity: '',
      
    }));
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }
  
  getCombinedValue(categoryId: string, subcategoryId: string): string {
    return categoryId + ' ' + subcategoryId;
  }
 

  selectedOptionImageIndex: number[] = [];

  // Modify onOptionClick to accept index
  onOptionClick(imageIndex: number): void {
    this.selectedOptionImageIndex.push(imageIndex);
    console.log(this.selectedOptionImageIndex)
  }
  
  onSelectionChange(event: any): void {
    const selectedId = this.toppings.value;
    const [categoryId, subcategoryId] = selectedId.split(' ');
    this.categoryID = categoryId;
    this.subcategoryID = subcategoryId;
    const foundCategory = this.DataCategory.find(
      (category: any) => category._id === categoryId
    );
    if (foundCategory) {
      const foundSubCategory = foundCategory.subCategory.find(
        (sub: any) => sub._id === subcategoryId
      );
      if (foundSubCategory) {
        this.nameCategorySelect =
          foundCategory.name + ' >> ' + foundSubCategory.name;
      }
    }
  }

  showPreview(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push(e.target?.result as string);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  async onSubmit() {
    await this.processImg();

    const idShop = localStorage.getItem('userId');
    const newImages = this.URLImg.map((url) => ({ url }));
     // Sắp xếp lại mảng newImages theo selectedOptionImageIndex
     const selectedImages = this.selectedOptionImageIndex.map(index => {
      if (index >= 0 && index < this.URLImg.length) {
        return this.URLImg[index];
      }
      return null;
    });
    const optionsWithImages = this.FormProduct.value.options.map((option: any, index: number) => {
      if (index < selectedImages.length) {
        option.imageUrl = selectedImages[index];
      }
      return option;
    });
    console.log(selectedImages)
    const dataProduct = {
      name: this.FormProduct.value.name,
      description: this.FormProduct.value.description,
      idCategory: this.categoryID,
      idCategoryShop: 'idCategoryShop',
      idSubCategory: this.subcategoryID,
      idShop: idShop,
      image: newImages,
      option: optionsWithImages,
    };

    this.productSevice.addProduct(dataProduct).subscribe((res) => {
      console.log(res);
      this.toast.success('Add product to successfully!')

    });

    console.log(dataProduct);
  }

  // Process images
  async processImg() {
    const imageFiles: File[] = this.selectedImages.map((image) =>
      this.dataURItoFile(image, 'image.png')
    );
    const res = await this.productSevice.uploadImg(imageFiles).toPromise();
    this.URLImg = res.imageUrls;
  }

  dataURItoFile(dataURI: string, filename: string): File {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'image/png' }); // Adjust type if needed

    return new File([blob], filename);
  }
}