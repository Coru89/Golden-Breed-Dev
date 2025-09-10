if (!customElements.get('share-button')) {
  customElements.define('share-button', class ShareButton extends DetailsDisclosure {
    constructor() {
      super();

      this.elements = {
        shareButton: this.querySelector('button.share-button__copy'),
        shareSummary: this.querySelector('summary'),
        successMessage: this.querySelector('[id^="ShareMessage"]'),
        urlInput: this.querySelector('input')
      }
      this.urlToShare = this.elements.urlInput ? this.elements.urlInput.value : document.location.href;

      // Prevent default click behavior
      this.mainDetailsToggle.addEventListener('click', (e) => {
        // e.preventDefault();
        this.navigator.share({ url: this.urlToShare, title: document.title });
      });
      

      // Open on hover
      // this.mainDetailsToggle.addEventListener('mouseenter', this.openModal.bind(this));
      
      // Close on mouse leave (with slight delay)
      this.mainDetailsToggle.addEventListener('mouseleave', this.scheduleClose.bind(this));
      
      // Keep open when hovering over the content
      this.mainDetailsToggle.addEventListener('mouseenter', this.cancelClose.bind(this));

      this.mainDetailsToggle.addEventListener('toggle', this.toggleDetails.bind(this));
      this.mainDetailsToggle.querySelector('.share-button__copy').addEventListener('click', this.copyToClipboard.bind(this));
      
      this.closeTimeout = null;
    }

    openModal() {
      this.cancelClose();
      this.mainDetailsToggle.open = true;
    }

    scheduleClose() {
      this.closeTimeout = setTimeout(() => {
        this.mainDetailsToggle.open = false;
      }, 300);
    }

    cancelClose() {
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
        this.closeTimeout = null;
      }
    }

    toggleDetails() {
      if (!this.mainDetailsToggle.open) {
        this.elements.successMessage.classList.add('hidden');
        this.elements.successMessage.textContent = '';
        this.elements.shareSummary.focus();
      }
    }

    copyToClipboard() {
      navigator.clipboard.writeText(this.elements.urlInput.value).then(() => {
        this.elements.successMessage.classList.remove('hidden');
        this.elements.successMessage.textContent = window.accessibilityStrings.shareSuccess;
        // No need to show/focus close button anymore
      });
    }

    updateUrl(url) {
      this.urlToShare = url;
      this.elements.urlInput.value = url;
    }
  });
}