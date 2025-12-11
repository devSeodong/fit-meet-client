<template>
  <div class="flex flex-col">
    <label class="text-base font-semibold text-[#8A8F6E]">비밀번호</label>
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
    <label class="text-base font-semibold text-[#8A8F6E]">비밀번호 확인</label>
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

// 부모에게 값과 상태를 전달하기 위한 Emit 정의
const emit = defineEmits([
  'update:password',
  'update:pwCheck',
  'update:isPasswordValid',
]);

// 내부 상태 관리
const passwordLocal = ref('');
const pwCheckLocal = ref('');
const pwStatus = ref('');
const passwordInputRef = ref(null); // 포커스를 위한 ref

// 로직 복사
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
const isPasswordValid = ref(false);
const passwordValidationMsg = ref('');

// 비밀번호 정규식 유효성 검사 및 부모에게 값 전달
watch(passwordLocal, newPassword => {
  emit('update:password', newPassword);

  if (!newPassword) {
    isPasswordValid.value = false;
    passwordValidationMsg.value = '';
    return;
  }

  if (PASSWORD_REGEX.test(newPassword)) {
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

// 비밀번호 일치 메시지
const passwordMsg = computed(() => {
  if (!passwordLocal.value || !pwCheckLocal.value) return '';

  if (passwordLocal.value === pwCheckLocal.value) {
    pwStatus.value = 'success';
    return '비밀번호가 일치합니다.';
  } else {
    pwStatus.value = 'error';
    return '비밀번호가 일치하지 않습니다.';
  }
});

// 부모 컴포넌트가 접근할 수 있도록 중요한 상태와 ref를 노출 (핵심!)
defineExpose({
  isMatch: computed(() => passwordLocal.value === pwCheckLocal.value),
  isValidRegex: isPasswordValid,
  passwordInput: passwordInputRef, // ref 노출
  passwordValue: passwordLocal,
  pwCheckValue: pwCheckLocal,
});
</script>

<style scoped>
/* style은 필요하다면 여기에 추가 */
</style>
