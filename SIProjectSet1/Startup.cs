using SIProjectSet1.Infrastructure;
using SIProjectSet1;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.UserService;

namespace SIProjectSet1
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            HostingEnvironment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // I am literally registering this DB Context here, just so I can use EF Core Identity
            services.AddDbContext<SIProjectSet1Context>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
           
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddControllers()
                .AddControllersAsServices();


            services.AddScoped<IUserService, UserService.UserService>();
            //.AddNewtonsoftJson(options =>
            //{
            //    // To prevent "A possible object cycle was detected which is not supported" error
            //    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            //    // To get our property names serialized in the first letter lowercased
            //    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            //});
            if (HostingEnvironment.IsDevelopment())
            {
                services.AddSwaggerGen();
                // SwaggerHelper.ConfigureService(services);
            }
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            #region Swagger

            if (HostingEnvironment.IsDevelopment())
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    //c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    //c.RoutePrefix = "";
                });
            }

            #endregion

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }
    }
}
