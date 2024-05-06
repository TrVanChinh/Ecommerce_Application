import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ImageOption } from 'src/app/Core/Models/ImgOption.model';
import { CategoryService } from 'src/app/Core/Service/category.service';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  OptionImg: FormGroup;
  FormProduct!: FormGroup;
  URLImg: string[] = [];
  selectedImages: string[] = [];
  DataCategory: any;
  categoryID: string = '';
  subcategoryID: string = '';

  toppings = new FormControl();
  nameCategorySelect: string = '';
  constructor(
    private productSevice: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.OptionImg = this.fb.group({});
    this.FormProduct = this.fb.group({
      name: '',
      description: '',
      image: [''],
      option: this.OptionImg,
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategory().subscribe((res) => {
      this.DataCategory = res.data;
    });
  }

  getCombinedValue(categoryId: string, subcategoryId: string): string {
    return categoryId + ' ' + subcategoryId;
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

  // ----------- optiom
  showPreview(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push(e.target?.result as string);
          const newIndex = this.selectedImages.length - 1;
          // mỗi ảnh sẽ có add them 1 formcontrols
          this.addFormControls(newIndex);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  addFormControls(index: number) {
    this.OptionImg.addControl(`color${index}`, new FormControl(''));
    this.OptionImg.addControl(`price${index}`, new FormControl(''));
    this.OptionImg.addControl(`quantity${index}`, new FormControl(''));
  }

  async onSubmit() {
    await this.processImg();

    const dataoptions: ImageOption[] = this.URLImg.map((image, index) => ({
      imageUrl: image,
      color: this.OptionImg.value[`color${index}`],
      price: this.OptionImg.value[`price${index}`],
      quantity: this.OptionImg.value[`quantity${index}`],
    }));
    const idShop = localStorage.getItem('userId');
    const newImages = this.URLImg.map((url) => ({ url }));
    console.log(this.categoryID)
    console.log(this.subcategoryID)
    
    const dataProduct = {
      name: this.FormProduct.value.name,
      description: this.FormProduct.value.description,
      idCategory: this.categoryID,
      idCategoryShop: 'idCategoryShop',
      idSubCategory: this.subcategoryID,
      idShop: idShop,
      image: newImages,
      option: dataoptions,
    };
    this.productSevice.addProduct(dataProduct).subscribe((res) => {
      console.log(res);
    });

    console.log(dataProduct)
  }

  //sử lý hình ảnh
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
