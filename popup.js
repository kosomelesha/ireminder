// Clean and professional popup for Video Reminder
class VideoReminderPopup {
    constructor() {
        this.elements = {
            textarea: document.getElementById('urls'),
            saveBtn: document.getElementById('save'),
            clearBtn: document.getElementById('clear'),
            status: document.getElementById('status'),
            loading: document.getElementById('loading')
        };
        
        // Debug logging
        console.log('Elements found:', {
            textarea: !!this.elements.textarea,
            saveBtn: !!this.elements.saveBtn,
            clearBtn: !!this.elements.clearBtn,
            status: !!this.elements.status,
            loading: !!this.elements.loading
        });
        
        this.init();
    }

    async init() {
        // Load URLs immediately when popup opens
        await this.loadUrls();
        this.bindEvents();
        this.addPlaceholder();
    }

    async loadUrls() {
        try {
            const data = await chrome.storage.local.get({ allowedUrls: [] });
            this.elements.textarea.value = (data.allowedUrls || []).join('\n');
        } catch (error) {
            this.showStatus('Failed to load settings', 'error');
        }
    }

    bindEvents() {
        // Save button with loading state
        if (this.elements.saveBtn) {
            this.elements.saveBtn.onclick = async () => {
                console.log('Save button clicked');
                await this.saveUrls();
            };
        }

        // Clear button with confirmation
        if (this.elements.clearBtn) {
            this.elements.clearBtn.onclick = async () => {
                console.log('Clear button clicked');
                await this.clearUrls();
            };
        }

        // Auto-save on Enter key
        if (this.elements.textarea) {
            this.elements.textarea.addEventListener("keydown", (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    this.saveUrls();
                }
            });

            // Real-time character count
            this.elements.textarea.addEventListener("input", () => {
                this.updateCharacterCount();
            });
        }
    }

    addPlaceholder() {
        const placeholders = [
            "youtube.com\nfacebook.com\ninstagram.com",
            "reddit.com\nstackoverflow.com\ngithub.com",
            "twitter.com\nlinkedin.com\nmedium.com",
            "Add your favorite websites here"
        ];
        
        const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
        if (this.elements.textarea) {
            this.elements.textarea.placeholder = randomPlaceholder;
        }
    }

    updateCharacterCount() {
        if (!this.elements.textarea) return;
        
        const count = this.elements.textarea.value.length;
        const maxChars = 1000;
        
        if (count > maxChars * 0.8) {
            this.elements.textarea.style.borderColor = count > maxChars ? '#f44336' : '#ff9800';
        } else {
            this.elements.textarea.style.borderColor = '#4CAF50';
        }
    }

    async saveUrls() {
        if (!this.elements.textarea) return;
        
        const urls = this.elements.textarea.value
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);

        // Validation
        if (urls.length === 0) {
            this.showStatus('Please add at least one website', 'error');
            return;
        }

        // Show loading
        this.showLoading(true);
        if (this.elements.saveBtn) {
            this.elements.saveBtn.disabled = true;
        }

        try {
            await chrome.storage.local.set({ allowedUrls: urls });
            
            // Add some delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Change button text to "Saved!" temporarily
            if (this.elements.saveBtn) {
                const originalText = this.elements.saveBtn.textContent;
                this.elements.saveBtn.textContent = 'Saved!';
                this.elements.saveBtn.style.background = 'rgba(76, 175, 80, 0.3)';
                this.elements.saveBtn.style.color = '#4CAF50';
                this.elements.saveBtn.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                
                // Revert back to original after 2 seconds
                setTimeout(() => {
                    this.elements.saveBtn.textContent = originalText;
                    this.elements.saveBtn.style.background = 'rgba(255, 255, 255, 0.25)';
                    this.elements.saveBtn.style.color = '#333';
                    this.elements.saveBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }, 2000);
            }
            
            // Add a subtle animation
            if (this.elements.saveBtn) {
                this.elements.saveBtn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.elements.saveBtn.style.transform = 'scale(1)';
                }, 200);
            }
            
        } catch (error) {
            console.error('Save error:', error);
            this.showStatus('Failed to save settings', 'error');
        } finally {
            this.showLoading(false);
            if (this.elements.saveBtn) {
                this.elements.saveBtn.disabled = false;
            }
        }
    }

    async clearUrls() {
        if (!this.elements.textarea) return;
        
        if (this.elements.textarea.value.trim()) {
            if (confirm('Are you sure you want to clear all websites?')) {
                // Show loading
                this.showLoading(true);
                if (this.elements.clearBtn) {
                    this.elements.clearBtn.disabled = true;
                }

                try {
                    // Clear the textarea
                    this.elements.textarea.value = '';
                    
                    // Save empty array to storage
                    await chrome.storage.local.set({ allowedUrls: [] });
                    
                    // Add some delay for better UX
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // Change button text to "Cleared!" temporarily
                    if (this.elements.clearBtn) {
                        const originalText = this.elements.clearBtn.textContent;
                        this.elements.clearBtn.textContent = 'Cleared!';
                        this.elements.clearBtn.style.background = 'rgba(76, 175, 80, 0.3)';
                        this.elements.clearBtn.style.color = '#4CAF50';
                        this.elements.clearBtn.style.borderColor = 'rgba(76, 175, 80, 0.6)';
                        
                        // Revert back to original after 2 seconds
                        setTimeout(() => {
                            this.elements.clearBtn.textContent = originalText;
                            this.elements.clearBtn.style.background = 'rgba(255, 255, 255, 0.25)';
                            this.elements.clearBtn.style.color = '#333';
                            this.elements.clearBtn.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                        }, 2000);
                    }
                    
                    this.showStatus('All websites cleared', 'success');
                    this.updateCharacterCount();
                    
                    // Add a subtle animation
                    if (this.elements.clearBtn) {
                        this.elements.clearBtn.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            this.elements.clearBtn.style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                } catch (error) {
                    console.error('Clear error:', error);
                    this.showStatus('Failed to clear settings', 'error');
                } finally {
                    this.showLoading(false);
                    if (this.elements.clearBtn) {
                        this.elements.clearBtn.disabled = false;
                    }
                }
            }
        } else {
            this.showStatus('Nothing to clear', 'error');
        }
    }

    showLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.style.display = show ? 'block' : 'none';
        }
        if (this.elements.saveBtn) {
            this.elements.saveBtn.style.opacity = show ? '0.6' : '1';
        }
        if (this.elements.clearBtn) {
            this.elements.clearBtn.style.opacity = show ? '0.6' : '1';
        }
    }

    showStatus(message, type = 'success') {
        if (!this.elements.status) return;
        
        this.elements.status.textContent = message;
        this.elements.status.className = `status ${type} show`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (this.elements.status) {
                this.elements.status.classList.remove('show');
            }
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing popup');
    new VideoReminderPopup();
});
