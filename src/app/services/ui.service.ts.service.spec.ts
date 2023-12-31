import { TestBed } from '@angular/core/testing'

import { UiServiceTsService } from './ui.service.ts.service'

describe('UiServiceTsService', () => {
  let service: UiServiceTsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(UiServiceTsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('Should toggle showBannerForm', () => {
    expect(service.showBannerForm).toBe(false)

    service.toggle()

    expect(service.showBannerForm).toBe(true)
  })
})
