import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Grid, Typography } from '@mui/material';

const WorksmobileSDK = () => {
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    applicant: userName || '',
    department: '',
    amount: '',
    reason: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.worksmobile.net/static/wm/woff/edge/3.6/sdk.js';
    script.async = true;
    script.onload = () => {
      const woffId = process.env.REACT_APP_WOFF_ID;

      // WOFF 初期化
      window.woff.init({ woffId })
        .then(() => {
          console.log('WOFF initialized successfully!');
          getProfile();
          setIsLoaded(true);
        })
        .catch((err) => {
          window.alert(err);
          console.error(err);
        });
    };
    script.onerror = () => {
      console.error('Failed to load SDK');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getProfile = () => {
    window.woff.getProfile().then((profile) => {
      setUserName(profile.displayName);
    }).catch((err) => {
      console.log(err);
      window.alert(err);
    });
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { applicant, department, amount, reason } = formData;

    // 稟議書メッセージ
    const message = `
      稟議書提出
      申請者: ${applicant}
      部署: ${department}
      金額: ${amount}
      理由: ${reason}
    `;

    if (isLoaded) {
      // WOFF SDKを通じてメッセージ送信
      window.woff.sendMessage({ content: message })
        .then(() => {
          console.log('稟議書が送信されました');
          window.alert('稟議書が正常に送信されました');
        })
        .catch((err) => {
          console.log(err);
          window.alert('送信エラーが発生しました');
        });
    } else {
      window.alert('WOFF SDK がまだ読み込まれていません');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        稟議書フォーム
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="申請者名"
            variant="outlined"
            fullWidth
            name="applicant"
            value={formData.applicant}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="部署名"
            variant="outlined"
            fullWidth
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="金額"
            variant="outlined"
            fullWidth
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="理由"
            variant="outlined"
            fullWidth
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            送信
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WorksmobileSDK;