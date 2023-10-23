$(document).ready(function () {
    $('#loading').hide();
  });

  function locationBasedRecommend() {
    const api_key = "apikey"  // <- API KEY 입력
    const keywords = document.getElementById('keywords').value
    $('#loading').show();

    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: keywords + ' 지역에 갈만한 장소 3곳을 추천하는데 장소에 대한 설명은 제거하면서 있는 사실만을 근거하는 답변을 줘.' },
    ]

    const data = {
      model: 'gpt-3.5-turbo',
      top_p: 0.1,
      temperature: 0.1,
      max_tokens: 200,
      n: 1,
      messages: messages,
    }

    $.ajax({
      url: "https://api.openai.com/v1/chat/completions",
      method: 'POST',
      headers: {
        Authorization: "Bearer " + api_key,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    }).then(function (response) {
      $('#loading').hide();
      console.log(response)
      let result = document.getElementById('result')
      result.innerHTML = '';

      let pre = document.createElement('pre')
      pre.style.fontSize = '20px';
      pre.innerHTML =  response.choices[0].message.content;
      result.appendChild(pre)

      document.getElementById('keywords').value = ''
    });
  }
