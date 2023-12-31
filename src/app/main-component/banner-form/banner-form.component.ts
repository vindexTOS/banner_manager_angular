import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { MatChipInputEvent } from '@angular/material/chips'
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import { Subject, Subscription } from 'rxjs'
import { FormService } from 'src/app/services/form.service'
import { UiServiceTsService } from 'src/app/services/ui.service.ts.service'
import { Store } from '@ngrx/store'
import {
  postbanner,
  postbannertodb,
} from 'src/app/Store/Form-post/Form.Actions'
import {
  channelactionapi,
  labelaction,
  labelactionapi,
  langaugeactionapi,
  zoneactionapi,
} from 'src/app/Store/Refrence/Refrence.Action'
import {
  getreferenceLabelList,
  getrefernceLangaugeList,
  getrefrenceChannelList,
  getrefrenceZoneList,
} from 'src/app/Store/Refrence/Refrence.Selector'
import { refrenceTypes } from 'src/app/Store/Refrence/Refrence.State'
import { geturlid } from 'src/app/Store/Blob/Blog.selector'
import { ImageService } from 'src/app/services/image.service'
import { environment } from 'src/env'
import { loadingForm } from 'src/app/Store/Form-post/Form.Selector'
import {
  GetStatusError,
  GetStatusLoading,
  GetStatusSuccsess,
} from 'src/app/Store/StatusHanndle/Status.selector'
import {
  statusError,
  statusSuccses,
} from 'src/app/Store/StatusHanndle/Status.action'
import { getquery } from 'src/app/Store/Banner-data/Banner.action'
@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css'],
})
export class BannerFormComponent implements OnInit, OnDestroy {
  uploadedImgSrc!: string
  imageSrc: string = ''
  sub: Subscription | any
  showBannerForm = false
  private loadingFormUpdates = Subscription

  error?: string
  succsess?: string
  exampleForm: FormGroup
  bannerForm: FormGroup

  refrenceChannels: refrenceTypes[] = []
  refrenceZones: refrenceTypes[] = []
  refrenceLabels: refrenceTypes[] = []
  refrenceLanguage: refrenceTypes[] = []
  fb: any
  selectedLabels: string[] = []

  priorityNums = Array.from({ length: 21 }, (_, index) => index)
  imageSrcSubscription: any
  baseUrl = environment.apiUrl
  formLoading = false
  constructor(
    private formService: FormService,
    private uiService: UiServiceTsService,
    private formBuilder: FormBuilder,
    private store: Store,
    private imageService: ImageService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.exampleForm = this.formBuilder.group({
      name: this.formBuilder.control('', Validators.required),
      channelId: this.formBuilder.control('', Validators.required),
      language: this.formBuilder.control('', Validators.required),
      zoneId: this.formBuilder.control('', Validators.required),
      priority: this.formBuilder.control('', Validators.required),
      // isCorporate: this.formBuilder.control('', Validators.required),
      url: this.formBuilder.control('', Validators.required),
      startDate: this.formBuilder.control('', Validators.required),
      endDate: this.formBuilder.control('', Validators.required),
      active: this.formBuilder.control(false),
    })

    this.sub = this.uiService
      .toggleShow()
      .subscribe((val) => (this.showBannerForm = val))

    this.bannerForm = this.formBuilder.group({
      labels: new FormControl([]),
    })
  }

  ngOnInit(): void {
    this.store.select(GetStatusLoading).subscribe((loading) => {
      this.formLoading = loading || false
    })

    this.store.select(GetStatusError).subscribe((error) => {
      this.error = error
      console.log(error)
    })
    this.store.select(GetStatusSuccsess).subscribe((succsess) => {
      this.succsess = succsess
      setTimeout(() => {
        this.succsess = ''
      }, 12000)
    })
    this.store.dispatch(channelactionapi())
    this.store.dispatch(zoneactionapi())
    this.store.dispatch(labelactionapi())
    this.store.dispatch(langaugeactionapi())
    // channel
    this.store.select(getrefrenceChannelList).subscribe((item) => {
      this.refrenceChannels = item
    })
    //  zone
    this.store.select(getrefrenceZoneList).subscribe((item) => {
      this.refrenceZones = item
    })
    //   labels
    this.store.select(getreferenceLabelList).subscribe((item) => {
      this.refrenceLabels = item
    })
    //   languages
    this.store.select(getrefernceLangaugeList).subscribe((item) => {
      this.refrenceLanguage = item
    })
    // img

    this.store.select(geturlid).subscribe((item) => {
      this.uploadedImgSrc = item
    })
    this.imageSrc = this.formService.imageSrc
    this.selectedLabels = this.formService.selectedLabels

    // loading

    this.imageSrcSubscription = this.imageService.imageSrc$.subscribe(
      (newImageSrc: string) => {
        this.imageSrc = newImageSrc
      },
    )
  }
  onDragOver(event: any) {
    event.preventDefault()
  }

  onDragLeave(event: any) {
    event.preventDefault()
  }

  onDrop(event: DragEvent) {
    this.formService.onFileDropped(event)
  }
  //
  onLabelSelect(event: any) {
    this.formService.onLabelSelect(event)
    this.selectedLabels = this.formService.selectedLabels
  }

  remove(label: string) {
    this.selectedLabels = this.selectedLabels.filter((val) => val !== label)
  }
  //
  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  onFileDropped(event: DragEvent) {
    this.formService.onFileDropped(event)
  }

  onInputChange(event: Event) {
    // console.log(event)
    this.formService.onInputChange(event)
  }

  closeForm() {
    this.uiService.toggle()
  }

  errorMessages(key: string) {
    return `${key} is required`
  }

  onSubmit() {
    let hasError = false

    if (!this.uploadedImgSrc) {
      this.store.dispatch(statusError({ error: 'You need to upload banner' }))
      setTimeout(() => {
        this.store.dispatch(statusError({ error: '' }))
      }, 1500)
      hasError = true
    }

    for (const controlName in this.exampleForm.controls) {
      const control = this.exampleForm.get(controlName)

      if (control?.invalid) {
        const errorMessage = this.errorMessages(controlName)
        this.store.dispatch(statusError({ error: ` ${errorMessage}` }))
        // console.log(`csdf`)
        hasError = true
        break
      }
    }

    if (!hasError) {
      const data = {
        ...this.exampleForm.value,
        labels: this.selectedLabels,
        fileId: this.uploadedImgSrc,
      }

      this.store.dispatch(postbannertodb(data))
      this.store.dispatch(
        getquery({ key: 'all', value: { pageIndex: 0, pageSize: 10 } }),
      )
      this.exampleForm.reset()
      this.formService.reset()
      this.selectedLabels = []
      this.uploadedImgSrc = ''
      this.imageSrc = ''
      this.closeForm()
      setTimeout(() => {
        this.store.dispatch(statusSuccses({ succses: '' }))
      }, 3000)
    }
  }
}
