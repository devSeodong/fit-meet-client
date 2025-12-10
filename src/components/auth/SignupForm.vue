<!-- 여기는 화면 -->
<!-- 
1. 이메일 input
2. 이메일 input 중복확인 div
3. 닉네임 input
5. 비밀번호 input
6. 비번확인 input (두개가 일치하는지 동적 확인 => 정규식 패턴 확인 )
7. 프로필 사진은...?

8. 회원가입 버튼
9. 폼데이터 전송 (이메일중복 확인, 회원가입)
-->
<template>
  <form @submit.stop.prevent="submitSignup" class="flex flex-col gap-7 mt-6">
    <!-- 이메일 -->
    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">이메일</label>

      <div class="flex gap-3 mt-2">
        <input
          type="email"
          v-model="email"
          placeholder="example@ssafy.com"
          ref="emailInput"
          class="flex-1 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        />
        <button
          type="button"
          @click="checkEmail"
          class="px-4 py-3 text-white rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
        >
          중복확인
        </button>
      </div>

      <p
        class="mt-1 text-sm"
        :class="{
          'text-red-600': emailStatus === 'error',
          'text-green-600': emailStatus === 'success',
        }"
      >
        {{ emailMsg }}
      </p>
    </div>

    <!-- 닉네임 -->
    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">이름</label>

      <input
        type="text"
        v-model="userName"
        placeholder="이름을 입력하세요..ex)홍길동"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        required
      />
    </div>

    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">닉네임</label>

      <input
        type="text"
        v-model="nickname"
        placeholder="닉네임을 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
        required
      />
    </div>

    <!-- 비밀번호 -->
    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]">비밀번호</label>
      <p class="text-[10px] text-gray-600">
        비밀번호는 8~20자이며, 영문자ㆍ숫자ㆍ특수문자를 각각 최소 1자 이상
        포함해야 합니다.
      </p>

      <input
        type="password"
        v-model="password"
        ref="passwordInput"
        placeholder="비밀번호를 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />
      <!-- 전체 폼 메시지 -->
      <p
        class="text-sm mt-1"
        :class="{
          'text-red-600': formMsgStatus === 'error',
          'text-green-600': formMsgStatus === 'success',
        }"
      >
        {{ formMsg }}
      </p>
    </div>

    <!-- 비밀번호 확인 -->
    <div class="flex flex-col">
      <label class="text-base font-semibold text-[#8A8F6E]"
        >비밀번호 확인</label
      >

      <input
        type="password"
        v-model="pwCheck"
        placeholder="비밀번호를 다시 입력하세요"
        class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
      />

      <p
        v-show="password && pwCheck"
        class="mt-1 text-sm"
        :class="{
          'text-red-600': pwStatus === 'error',
          'text-green-600': pwStatus === 'success',
        }"
      >
        {{ passwordMsg }}
      </p>
    </div>

    <!-- 회원가입 버튼 -->
    <button
      type="submit"
      class="w-full py-3 mt-2 text-white text-lg font-semibold rounded-xl bg-[#D3A373] hover:bg-[#b9885f] transition shadow"
    >
      회원가입
    </button>

    <div class="md:hidden text-center">
      <RouterLink
        to="/auth/login"
        class="text-sm text-[#68b478] hover:underline"
      >
        이미 계정이 있으신가요? 로그인하기
      </RouterLink>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import router from '@/router';

const store = useAuthStore();

const email = ref('');
const userName = ref('');
const nickname = ref('');
const password = ref('');
const pwCheck = ref('');
const formMsg = ref('');

const formMsgStatus = ref('');
watch([password, pwCheck], () => {
  formMsg.value = '';
  formMsgStatus.value = '';
});

const emailStatus = ref('');
const emailMsg = ref('');
const isEmailChecked = ref(false);

const emailInput = ref(null);
const passwordInput = ref(null);

// 비밀번호 확인
const pwStatus = ref('');
const passwordMsg = computed(() => {
  if (!password.value || !pwCheck.value) return '';
  if (formMsgStatus.value === 'error') return '';
  if (password.value === pwCheck.value) {
    pwStatus.value = 'success';
    return '비밀번호가 일치합니다.';
  } else {
    pwStatus.value = 'error';
    return '비밀번호가 일치하지 않습니다.';
  }
});

watch(email, () => {
  isEmailChecked.value = false;
  emailMsg.value = '';
});

// ⭐ 이메일 중복 체크
const checkEmail = async () => {
  const trimmedEmail = email.value.trim();

  // 🔥 공백이거나 빈 문자열이면 서버에 요청 보내지 않도록 막기
  if (!trimmedEmail) {
    emailStatus.value = 'error';
    emailMsg.value = '이메일을 입력해주세요!';
    emailInput.value?.focus();
    return;
  }

  const result = await store.checkEmail(email.value);

  console.log('이메일 중복확인:: ', result);
  if (result.available) {
    emailStatus.value = 'success';
    emailMsg.value = '사용 가능한 이메일입니다 :)';
    isEmailChecked.value = true;
  } else {
    emailStatus.value = 'error';
    emailMsg.value = result.message;
    isEmailChecked.value = false;
    emailInput.value?.focus();
  }
};

// ⭐ 회원가입
const submitSignup = async () => {
  if (!isEmailChecked.value) {
    emailMsg.value = '이메일 중복확인을 해주세요!';
    emailStatus.value = 'error';
    emailInput.value?.focus();
    return;
  }

  if (password.value !== pwCheck.value) {
    alert('비밀번호가 일치하지 않습니다!');
    passwordInput.value?.focus();
    return;
  }

  try {
    const res = await store.createUser({
      email: email.value,
      password: password.value,
      name: userName.value,
      nickname: nickname.value,
    });

    if (res.code === 0) {
      alert('회원가입 성공!');
      router.push({ name: 'login' });
      // router.push({ name: 'userHealthInfo' });
    }
  } catch (err) {
    // 여기서 err는 서버가 보낸 data 자체
    if (err.code === 1012) {
      formMsgStatus.value = 'error';
      formMsg.value = err.msg;
      passwordInput.value?.focus();
      return;
    }

    alert('서버 오류가 발생했습니다.');
  }
};
</script>
