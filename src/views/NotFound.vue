<script setup lang="ts"></script>

<template>
  <div class="header">
    <div class="logo">
      BUG <span>List</span> /
      <select class="project-name" placeholder="未选择">
        <option>擦擦是</option>
        <option>擦asdadada擦是</option>
      </select>
    </div>
    <div class="avatar">
      <img
        src="https://q1.qlogo.cn/g?b=qq&nk=180181332&s=640"
        alt=""
        srcset=""
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0px 20px;
  box-sizing: border-box;
  background-color: var(--background);
  box-shadow: var(--border-shadow);

  .logo {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 900;
    span {
      margin-left: 4px;
      margin-right: 6px;
      padding: 0px 8px;
      font-size: 22px;
      border-radius: calc(var(--border-radius) * 0.25);
      background-color: #739491;
      color: #fff;
    }
    .project-name {
      padding: 2px;
      margin-left: 4px;
      font-weight: 400;
      font-size: 22px;
      color: #999;
      border: none;
      outline: none;
      border-radius: calc(var(--border-radius) * 0.25);
    }
    .project-name:hover {
      background-color: var(--background-2);
    }
  }
  .avatar {
    width: 35px;
    height: 35px;
    background-color: var(--background-2);
    border-radius: 50px;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
