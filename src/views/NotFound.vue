<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-7 d-none d-lg-block">
        <img src="../assets/img/404.svg" alt="404" class="w-100" />
      </div>
      <div class="col-lg-5">
        <h1>404</h1>
        <h2>UH OH! You're lost.</h2>
        <p>
          The page you are looking for does not exist. How you got here is a mystery. But you can click the button below to go
          back to the homepage.
        </p>
        <router-link to="/"><el-button type="primary" round>Home</el-button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.col-lg-7 {
  margin-top: 9%;
}
.col-lg-5 {
  margin-top: 12%;
}

h1 {
  font-size: 8rem;
  font-weight: bold;
}

h2 {
  margin-bottom: 1rem;
  font-weight: bold;
}

p {
  margin-bottom: 1.5rem;
}

.el-button {
  padding: 0 4rem !important;
}
</style>
