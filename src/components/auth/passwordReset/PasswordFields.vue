<template>
  <div class="flex flex-col">
    <label class="text-base font-semibold text-[#8A8F6E]">새 비밀번호</label>
    <p class="text-[10px] text-gray-600">
      비밀번호는 8~20자이며, 영문자ㆍ숫자ㆍ특수문자를 각각 최소 1자 이상
      포함해야 합니다.
    </p>
    <input
      type="password"
      v-model="passwordLocal"
      placeholder="비밀번호를 입력하세요"
      :ref="el => (passwordInputRef = el)"
      class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
    />
    <p
      v-show="passwordLocal && passwordValidationMsg"
      class="mt-1 text-sm"
      :class="{
        'text-red-600': !isPasswordValid,
        'text-green-600': isPasswordValid,
      }"
    >
      {{ passwordValidationMsg }}
    </p>
  </div>

  <div class="flex flex-col mt-4">
    <label class="text-base font-semibold text-[#8A8F6E]"
      >새 비밀번호 확인</label
    >
    <input
      type="password"
      v-model="pwCheckLocal"
      placeholder="비밀번호를 다시 입력하세요"
      class="w-full mt-2 px-4 py-3 rounded-xl border border-[#D3D7B5] bg-white focus:ring-2 focus:ring-[#D3A373] outline-none transition"
    />
    <p
      v-show="passwordLocal && pwCheckLocal"
      class="mt-1 text-sm"
      :class="{
        'text-red-600': pwStatus === 'error',
        'text-green-600': pwStatus === 'success',
      }"
    >
      {{ passwordMsg }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits, defineExpose } from 'vue';

const emit = defineEmits([
  'update:password',
  'update:pwCheck',
  'update:isPasswordValid',
  'update:isMatch',
]);

// 내부 상태 관리
const passwordLocal = ref('');
const pwCheckLocal = ref('');
const pwStatus = ref('');
const passwordInputRef = ref(null);

// 로직 복사
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
const isPasswordValid = ref(false);
const passwordValidationMsg = ref('');

// 비밀번호 정규식 유효성 검사 및 부모에게 값 전달
watch(passwordLocal, newPassword => {
  // 공백 제거 후 부모에게 값 전달
  const trimmedPassword = newPassword.trim();
  emit('update:password', trimmedPassword);

  if (!trimmedPassword) {
    isPasswordValid.value = false;
    passwordValidationMsg.value = '';
    return;
  }

  const regexTestResult = PASSWORD_REGEX.test(trimmedPassword);

  if (regexTestResult) {
    isPasswordValid.value = true;
    passwordValidationMsg.value = '사용 가능한 비밀번호입니다.';
  } else {
    isPasswordValid.value = false;
    passwordValidationMsg.value =
      '비밀번호는 8~20자, 영문자/숫자/특수문자를 포함해야 합니다.';
  }
});

// 비밀번호 확인 값 변경 시 부모에게 값 전달
watch(pwCheckLocal, newPwCheck => {
  emit('update:pwCheck', newPwCheck);
});

// 비밀번호 유효성 상태 변경 시 부모에게 전달
watch(isPasswordValid, isValid => {
  emit('update:isPasswordValid', isValid);
});

// 일치 여부 상태를 계산하는 Computed 속성
const isMatchComputed = computed(() => {
  const p1 = passwordLocal.value.trim();
  const p2 = pwCheckLocal.value.trim();

  // 두 필드가 모두 비어있지 않고 값이 일치해야 True
  return p1 !== '' && p2 !== '' && p1 === p2;
});

// isMatch 상태가 변경될 때마다 부모에게 전달
watch(
  isMatchComputed,
  newIsMatch => {
    emit('update:isMatch', newIsMatch);
  },
  { immediate: true },
); // 컴포넌트 마운트 직후 한 번 실행하여 초기 상태 전달

// 비밀번호 일치 메시지 (UI 표시용)
const passwordMsg = computed(() => {
  const p1 = passwordLocal.value.trim();
  const p2 = pwCheckLocal.value.trim();

  if (!p1 || !p2) {
    pwStatus.value = '';
    return '';
  }

  if (p1 === p2) {
    pwStatus.value = 'success';
    return '비밀번호가 일치합니다.';
  } else {
    pwStatus.value = 'error';
    return '비밀번호가 일치하지 않습니다.';
  }
});

// 외부에서 호출하여 내부 필드를 초기화하는 함수
function clearFields() {
  passwordLocal.value = '';
  pwCheckLocal.value = ''; // 초기화된 값을 부모에게 다시 전달하여 상태 동기화
  emit('update:password', '');
  emit('update:pwCheck', '');
  emit('update:isPasswordValid', false);
  emit('update:isMatch', false);
}

// 부모 컴포넌트가 접근할 수 있도록 노출
defineExpose({
  passwordInput: passwordInputRef,
  passwordValue: passwordLocal,
  pwCheckValue: pwCheckLocal,
  clearFields,
});
</script>

<style scoped></style>
